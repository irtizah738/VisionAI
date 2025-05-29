import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { logger } from '@/lib/logger';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function MetricsCard({ title, value, description }: MetricsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </Card>
  );
}

async function getMetrics() {
  const recentLogs = logger.getRecentLogs(1000);
  
  // Calculate metrics
  const totalRequests = recentLogs.length;
  const errorCount = recentLogs.filter(log => log.level === 'error').length;
  const averageTime = recentLogs
    .filter(log => log.data?.duration)
    .reduce((acc, log) => acc + parseFloat(log.data.duration), 0) / totalRequests || 0;
  
  // Group by endpoint
  const endpointStats = recentLogs.reduce((acc: Record<string, number>, log) => {
    if (log.data?.endpoint) {
      acc[log.data.endpoint] = (acc[log.data.endpoint] || 0) + 1;
    }
    return acc;
  }, {});

  return {
    totalRequests,
    errorCount,
    averageTime,
    endpointStats,
    recentLogs: recentLogs.slice(-50), // Last 50 logs
  };
}

function LogTable({ logs }: { logs: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">Level</th>
            <th className="px-4 py-2">Message</th>
            <th className="px-4 py-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i} className={log.level === 'error' ? 'bg-red-50' : ''}>
              <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2">{log.level}</td>
              <td className="px-4 py-2">{log.message}</td>
              <td className="px-4 py-2">{log.data?.duration || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function MonitoringPage() {
  const metrics = await getMetrics();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">AI System Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricsCard
          title="Total Requests"
          value={metrics.totalRequests}
          description="Last 1000 requests"
        />
        <MetricsCard
          title="Error Rate"
          value={`${((metrics.errorCount / metrics.totalRequests) * 100).toFixed(1)}%`}
          description={`${metrics.errorCount} errors`}
        />
        <MetricsCard
          title="Average Response Time"
          value={`${metrics.averageTime.toFixed(2)}ms`}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Endpoint Usage</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(metrics.endpointStats).map(([endpoint, count]) => (
          <MetricsCard
            key={endpoint}
            title={endpoint}
            value={count}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
      <Suspense fallback={<div>Loading logs...</div>}>
        <LogTable logs={metrics.recentLogs} />
      </Suspense>
    </div>
  );
} 