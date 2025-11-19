import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/login-form'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="container mx-auto flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Log in to your Letterise account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoginFormFallback />}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
