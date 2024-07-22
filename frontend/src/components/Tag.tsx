import Link from "next/link";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
interface Props {
  text: string;
  isOnBackground?: boolean;
}

const Tag = ({ text, isOnBackground = false }: Props) => {
  return (
    <Badge variant={"outline"} className="group opacity-75 hover:opacity-100">
      <Link
        href="#"
        className={cn(
          isOnBackground ? "text-background" : "text-foreground",
          "text-sm font-semibold lowercase opacity-75 group-hover:opacity-100"
        )}
      >
        {text.split(" ").join("-")}
      </Link>
    </Badge>
  );
};

export default Tag;
