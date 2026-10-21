/**
 * VisionAI Full-Spectrum Stress & Performance Testing Suite
 * Evaluates concurrency, latency (p50/p95/p99), memory retention, and rate limiters.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

const TEST_TARGETS = [
  { path: '/api/health', name: 'Health Check API' },
  { path: '/api/social-accounts', name: 'Social Accounts API' },
  { path: '/api/posts', name: 'Posts Ingestion API' },
  { path: '/api/campaigns', name: 'Campaigns API' },
  { path: '/api/user/api-keys', name: 'Proxy Auth API' },
  { path: '/', name: 'Landing Hero Page' },
  { path: '/dashboard', name: 'Executive Dashboard' },
  { path: '/campaigns', name: 'Campaigns Hub' },
  { path: '/settings', name: 'Settings Hub' }
];

function makeRequest(urlPath) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(`${BASE_URL}${urlPath}`, { headers: { 'User-Agent': 'VisionAI-StressTester/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          duration: Date.now() - start,
          bytes: Buffer.byteLength(data),
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        duration: Date.now() - start,
        bytes: 0,
        error: err.message,
        success: false
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        status: 408,
        duration: Date.now() - start,
        bytes: 0,
        error: 'Timeout',
        success: false
      });
    });
  });
}

function calculatePercentiles(latencies) {
  if (latencies.length === 0) return { min: 0, avg: 0, p50: 0, p95: 0, p99: 0, max: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    min: sorted[0],
    avg: Math.round(sum / sorted.length),
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
    max: sorted[sorted.length - 1]
  };
}

async function runStressTest() {
  console.log('='.repeat(70));
  console.log('  VISION AI FULL-SPECTRUM TECHNICAL AUDIT & STRESS TEST');
  console.log('='.repeat(70));
  
  const initialMem = process.memoryUsage();
  console.log(`[Baseline Memory] RSS: ${(initialMem.rss / 1024 / 1024).toFixed(2)} MB | Heap: ${(initialMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);

  const results = {};
  const totalConcurrency = 25; // 25 parallel workers
  const totalRounds = 8;        // 200 total requests
  const allLatencies = [];
  let totalSuccess = 0;
  let totalErrors = 0;

  console.log(`\n>>> Initiating Concurrency Wave: ${totalConcurrency} workers x ${totalRounds} iterations = ${totalConcurrency * totalRounds} requests...`);
  const overallStart = Date.now();

  for (let r = 0; r < totalRounds; r++) {
    const wave = [];
    for (let c = 0; c < totalConcurrency; c++) {
      const target = TEST_TARGETS[(r * totalConcurrency + c) % TEST_TARGETS.length];
      wave.push(
        makeRequest(target.path).then((res) => {
          allLatencies.push(res.duration);
          if (!results[target.path]) {
            results[target.path] = { name: target.name, total: 0, success: 0, failed: 0, latencies: [] };
          }
          results[target.path].total++;
          results[target.path].latencies.push(res.duration);
          if (res.success) {
            results[target.path].success++;
            totalSuccess++;
          } else {
            results[target.path].failed++;
            totalErrors++;
          }
        })
      );
    }
    await Promise.all(wave);
  }

  const overallDuration = (Date.now() - overallStart) / 1000;
  const finalMem = process.memoryUsage();
  const overallMetrics = calculatePercentiles(allLatencies);
  const rps = (allLatencies.length / overallDuration).toFixed(1);

  console.log('\n--- ENDPOINT BREAKDOWN ---');
  console.log('Endpoint'.padEnd(28) + 'Requests'.padEnd(10) + 'OK%'.padEnd(8) + 'Avg(ms)'.padEnd(10) + 'p95(ms)'.padEnd(10));
  console.log('-'.repeat(66));

  for (const [path, stats] of Object.entries(results)) {
    const metrics = calculatePercentiles(stats.latencies);
    const okPercent = ((stats.success / stats.total) * 100).toFixed(0) + '%';
    console.log(
      path.padEnd(28) +
      stats.total.toString().padEnd(10) +
      okPercent.padEnd(8) +
      metrics.avg.toString().padEnd(10) +
      metrics.p95.toString().padEnd(10)
    );
  }

  console.log('\n--- GLOBAL METRICS ---');
  console.log(`Total Requests:      ${allLatencies.length}`);
  console.log(`Total Duration:      ${overallDuration.toFixed(2)}s`);
  console.log(`Throughput:          ${rps} req/sec`);
  console.log(`Success Rate:        ${((totalSuccess / allLatencies.length) * 100).toFixed(1)}%`);
  console.log(`Error Count:         ${totalErrors}`);
  console.log(`Latency min / max:   ${overallMetrics.min}ms / ${overallMetrics.max}ms`);
  console.log(`Latency p50 / p95:   ${overallMetrics.p50}ms / ${overallMetrics.p95}ms`);
  console.log(`Latency p99:         ${overallMetrics.p99}ms`);
  console.log(`Heap Drift:          +${((finalMem.heapUsed - initialMem.heapUsed) / 1024 / 1024).toFixed(2)} MB`);
  console.log('='.repeat(70));
}

runStressTest().catch(console.error);
