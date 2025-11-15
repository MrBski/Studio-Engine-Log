import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gauge, List, History, Bot, Camera } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] space-y-8 text-center">
      <h1 className="text-3xl font-headline font-bold text-center text-foreground">Engine Log</h1>
      <div className="w-full max-w-md space-y-4 pt-4">
        <Button asChild size="lg" className="w-full h-20 text-xl font-headline shadow-lg transition-transform hover:scale-105" variant="default">
          <Link href="/preview">
            <Camera className="mr-4 h-8 w-8" />
            INPUT LOG
          </Link>
        </Button>
        <Button asChild size="lg" className="w-full h-20 text-xl font-headline shadow-lg transition-transform hover:scale-105" variant="outline">
          <Link href="/last-record">
            <History className="mr-4 h-8 w-8 text-primary" />
            Log Activity
          </Link>
        </Button>
        <Button asChild size="lg" className="w-full h-20 text-xl font-headline shadow-lg transition-transform hover:scale-105" variant="outline">
          <Link href="/inventory">
            <List className="mr-4 h-8 w-8 text-primary" />
            LIST INV
          </Link>
        </Button>
      </div>
    </div>
  );
}
