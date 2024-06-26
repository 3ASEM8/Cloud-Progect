import Link from "next/link";
import styles from "./header.module.css";
import NavBar from "./NavBar";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const token = cookies().get("jwtToken")?.value || "";
  const userPayloadFromToken = verifyTokenForPage(token);
  return (
    <header className={styles.header}>
      <NavBar isAdmin={userPayloadFromToken?.isAdmin || false} />
      <div className={styles.right}>
        {userPayloadFromToken ? (
          <>
            <strong className="text-blue-800 md:text-xl capitalize">
              {userPayloadFromToken?.username}
            </strong>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link className={styles.btn} href="/login">
              Login
            </Link>
            <Link className={styles.btn} href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
