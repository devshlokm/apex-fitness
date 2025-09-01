import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Nutrition() {
  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <header className="bg-card px-4 pt-12 pb-6 shadow-sm border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
        <p className="text-muted-foreground">Track your meals and nutrition</p>
      </header>

      <main className="px-4 py-6 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed nutrition tracking features coming soon...
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
