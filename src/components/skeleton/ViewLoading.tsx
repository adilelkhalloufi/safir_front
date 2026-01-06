import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function ViewLoading() {
  return (
    <div className="grid gap-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[150px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Skeleton className="h-4 w-[120px] mb-2" />
              <Skeleton className="h-5 w-[180px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[120px] mb-2" />
              <Skeleton className="h-6 w-[140px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-6 w-[80px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-5 w-[150px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-4 w-[120px] mb-2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[150px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[200px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-5 w-[150px]" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-[80px] mb-2" />
                    <Skeleton className="h-5 w-[60px]" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-[100px] mb-2" />
                    <Skeleton className="h-6 w-[100px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Type Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-5 w-[150px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-6 w-[140px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[120px] mb-2" />
              <Skeleton className="h-5 w-[60px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-6 w-[80px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
