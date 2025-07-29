import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-6 px-4">
      <h1 className="text-4xl font-bold">Oops — something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        We couldn’t fetch the latest quote from&nbsp;Alpha Vantage.  
        Their service may be temporarily unavailable. Please try again in a few minutes.
      </p>
      <Button onClick={() => navigate("/")}>Back to previous page</Button>
    </div>
  );
}
