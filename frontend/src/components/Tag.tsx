import Link from "next/link";
import { Badge } from "./ui/badge";
interface Props {
  text: string;
  isOnBackground?: boolean;
}

const Tag = ({ text, isOnBackground = false }: Props) => {
  return (
    <Badge variant={"outline"}>
      <Link
        href="#"
        className={`text-sm font-light lowercase ${
          isOnBackground ? `text-background` : `text-muted-foreground`
        } brightness-75 hover:brightness-125`}
      >
        {text.split(" ").join("-")}
      </Link>
    </Badge>
  );
};

export default Tag;
