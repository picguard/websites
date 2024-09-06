import "flag-icons/css/flag-icons.min.css";
import { LngProps } from "@/types/i18next-lng";

const Comment = (
  props: LngProps & { author: String; comment: String; flag?: String },
) => {
  return (
    <div className="mx-4 flex w-56 flex-col rounded-lg bg-gray-100 p-4 hover:cursor-pointer dark:bg-gray-700">
      <span className="text-lg font-bold text-black dark:text-white/90">
        {props.comment}
      </span>
      <div className="mt-2 flex flex-row items-center">
        {props.flag && <span className={`${props.flag} mr-1`} />}
        <span className="text-sm text-gray-600 dark:text-white/80">
          {props.author}
        </span>
      </div>
    </div>
  );
};

export default Comment;
