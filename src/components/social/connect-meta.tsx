import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetaService } from '@/services/meta';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export function ConnectMeta() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>();
  const [instagramAccounts, setInstagramAccounts] = useState<any[]>([]);

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      // Redirect to Facebook login
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
        window.location.origin + '/settings/social'
      )}&provider=facebook`;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to Facebook',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFacebookPages = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const metaService = new MetaService(session.accessToken as string);
      const response = await metaService.getFacebookPages();
      setPages(response.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load Facebook pages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInstagramAccounts = async (pageId: string) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setSelectedPage(pageId);
      const metaService = new MetaService(session.accessToken as string);
      const response = await metaService.getInstagramAccounts(pageId);
      setInstagramAccounts(response.instagram_business_account ? [response.instagram_business_account] : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load Instagram accounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Facebook</CardTitle>
          <CardDescription>Connect your Facebook page to post updates</CardDescription>
        </CardHeader>
        <CardContent>
          {!session?.accessToken ? (
            <Button onClick={handleFacebookLogin} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Facebook'}
            </Button>
          ) : (
            <div className="space-y-4">
              <Button onClick={loadFacebookPages} disabled={loading}>
                {loading ? 'Loading...' : 'Load Facebook Pages'}
              </Button>
              {pages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Select a Page</h4>
                  <div className="grid gap-2">
                    {pages.map((page) => (
                      <Button
                        key={page.id}
                        variant={selectedPage === page.id ? 'default' : 'outline'}
                        onClick={() => loadInstagramAccounts(page.id)}
                      >
                        {page.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPage && (
        <Card>
          <CardHeader>
            <CardTitle>Instagram</CardTitle>
            <CardDescription>Connected Instagram business accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {instagramAccounts.length > 0 ? (
              <div className="space-y-2">
                {instagramAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{account.username}</p>
                      <p className="text-sm text-muted-foreground">Business Account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Instagram business accounts found for this Facebook page
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 