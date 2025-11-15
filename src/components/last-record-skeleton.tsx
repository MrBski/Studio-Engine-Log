'use client';

import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

export function LastRecordPageSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-headline font-bold text-foreground">Last Recorded Data</h2>
            </div>
            <div className="space-y-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">Loading records...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
