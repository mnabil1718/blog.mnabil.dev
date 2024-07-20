/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Label } from "@/components/ui/label";

import * as React from "react";
import { Input } from "@/components/ui/input";

type Props = Readonly<{
  "data-test-id"?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
}>;

export default function FileInput({
  accept,
  label,
  onChange,
  "data-test-id": dataTestId,
}: Props): JSX.Element {
  return (
    <div className="flex items-center">
      <Label className="basis-1/3 sm:basis-1/5">{label}</Label>
      <Input
        className="basis-2/3 sm:basis-4/5"
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files)}
        data-test-id={dataTestId}
      />
    </div>
  );
}
