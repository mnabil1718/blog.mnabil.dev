"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "@/types/post";
import {
  ArchiveIcon,
  BookDashedIcon,
  Dot,
  Edit,
  EllipsisVerticalIcon,
  Icon,
  SendHorizonalIcon,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PostListTile = ({ post }: { post: Post }) => {
  return (
    <Link href={`/panel/posts/${post.id}/edit`} className="group">
      <div className="p-4 rounded-lg border border-border flex gap-4">
        <div className="relative w-36 aspect-square lg:w-56 lg:aspect-video bg-gray-400 rounded-lg overflow-hidden flex-none">
          <Image
            src={post.image?.url ?? ""}
            alt={post.title ?? ""}
            fill
            className="w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-3">
          <h2 className="text-lg lg:text-2xl font-bold leading-8 tracking-tight text-foreground line-clamp-1 group-hover:underline">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.preview}
          </p>
          <dl className="flex flex-wrap justify-between gap-1 text-xs">
            <dd className="flex items-center flex-wrap gap-1">
              <span>{post.status}</span>
              <span>
                <Dot size={14} />
              </span>
              <time dateTime={post.updated_at}>{post.updated_at}</time>
            </dd>
            <dd className="gap-1 flex flex-wrap">
              {post.tags.map((tag, idx) => {
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-full px-2 py-1"
                  >
                    {tag}
                  </div>
                );
              })}
            </dd>
          </dl>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {}} className="text-destructive">
                Delete
                <DropdownMenuShortcut>
                  <Trash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              {post.status != "draft" && (
                <DropdownMenuItem onClick={() => {}}>
                  Draft
                  <DropdownMenuShortcut>
                    <BookDashedIcon
                      size={16}
                      className="text-muted-foreground"
                    />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              {post.status != "published" && (
                <DropdownMenuItem onClick={() => {}}>
                  Publish
                  <DropdownMenuShortcut>
                    <SendHorizonalIcon
                      size={16}
                      className="text-muted-foreground"
                    />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              {post.status != "archived" && (
                <DropdownMenuItem onClick={() => {}}>
                  Archive
                  <DropdownMenuShortcut>
                    <ArchiveIcon size={16} className="text-muted-foreground" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Link>
  );
};

export default PostListTile;
