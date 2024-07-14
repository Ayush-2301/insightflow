import Image from "next/image";
import Link from "next/link";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex justify-between items-center px-6 py-4 border-b shadow">
      <div className="flex  items-center space-x-5 ">
        <h1 className=" text-xl font-semibold tracking-tight py-1 px-4 border-r border-gray-600 ">
          <Image
            src={"/logo-no-background.svg"}
            alt="InsightFlow-logo"
            width={150}
            height={150}
          />
        </h1>
        <div className="flex space-x-3 font-medium ">
          <Link href={"/"}>Home</Link>
          <Link href={"/watchlist"}>Watch Lists</Link>
          <Link href={"/tasks"}>Tasks</Link>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Navbar;
