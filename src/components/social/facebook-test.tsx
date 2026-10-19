import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetaService } from '@/services/meta';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export function FacebookTest() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    pagesTest?: boolean;
    postTest?: boolean;
    error?: string;
  }>({});

  const runTests = async () => {
    if (!session?.accessToken) {
      toast({
        title: 'Error',
        description: 'Please connect your Facebook account first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const results: typeof testResults = {};

    try {
      const metaService = new MetaService(session.accessToken as string);

      // Test 1: Get Facebook Pages
      try {
        const pagesResponse = await metaService.getFacebookPages();
        console.log('Pages Response:', pagesResponse);
        if (pagesResponse.data) {
          results.pagesTest = true;
          
          // If we have pages, try to post to the first one
          if (pagesResponse.data.length > 0) {
            const page = pagesResponse.data[0];
            try {
              const postResponse = await metaService.postToFacebookPage(page.id, {
                message: 'This is a test post from VisionAI 🚀',
              });
              console.log('Post Response:', postResponse);
              results.postTest = !postResponse.error;
            } catch (error) {
              console.error('Post Test Error:', error);
              results.postTest = false;
            }
          }
        } else {
          results.pagesTest = false;
          results.error = 'No Facebook pages found. Please make sure you have a Facebook page.';
        }
      } catch (error) {
        console.error('Pages Test Error:', error);
        results.pagesTest = false;
        results.error = 'Failed to fetch Facebook pages. Check permissions.';
      }

    } catch (error) {
      console.error('Test Error:', error);
      results.error = 'Failed to initialize Meta service';
    } finally {
      setLoading(false);
      setTestResults(results);
      
      // Show toast with results
      if (results.error) {
        toast({
          title: 'Test Failed',
          description: results.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Test Complete',
          description: `Pages: ${results.pagesTest ? '✅' : '❌'}, Post: ${results.postTest ? '✅' : '❌'}`,
          variant: results.pagesTest && results.postTest ? 'default' : 'destructive',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facebook Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={loading || !session?.accessToken}
        >
          {loading ? 'Running Tests...' : 'Run Integration Test'}
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Test Results:</h4>
            {testResults.pagesTest !== undefined && (
              <div className="flex items-center space-x-2">
                <span>Facebook Pages Access:</span>
                <span>{testResults.pagesTest ? '✅' : '❌'}</span>
              </div>
            )}
            {testResults.postTest !== undefined && (
              <div className="flex items-center space-x-2">
                <span>Facebook Post Test:</span>
                <span>{testResults.postTest ? '✅' : '❌'}</span>
              </div>
            )}
            {testResults.error && (
              <div className="text-sm text-red-500">
                Error: {testResults.error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 