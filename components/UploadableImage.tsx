import { ChangeEventHandler } from "react";
import classnames from "classnames";
import Image from "next/image";

export const UploadableImage = ({
  src,
  alt,
  isUploadable,
  onUpload,
}: {
  src: string;
  alt: string;
  isUploadable?: boolean;
  onUpload?: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <label className="flex">
      {isUploadable && (
        <input
          type="file"
          className="hidden"
          accept="image/x-png, image/jpeg"
          onChange={onUpload}
        />
      )}
      <figure className="relative h-28 w-28">
        <Image
          layout="fill"
          src={src ? src : "/images/pizza-toxic.png"}
          objectFit="cover"
          className={classnames("h-full w-full rounded-lg transition-all", {
            "cursor-pointer": isUploadable,
          })}
          alt={alt}
        />
      </figure>
    </label>
  );
};
