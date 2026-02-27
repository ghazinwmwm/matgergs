import { User } from "lucide-react";

const Profile = () => (
  <div className="min-h-screen bg-background pb-28">
    <div className="container mx-auto px-4 pt-12 pb-8">
      <h1 className="text-2xl font-bold text-foreground">حسابي</h1>
      <p className="text-sm text-muted-foreground mt-1">قريباً...</p>
    </div>
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <User className="h-14 w-14 mb-3 opacity-30" />
      <p className="text-base font-medium">قريباً</p>
    </div>
  </div>
);

export default Profile;
