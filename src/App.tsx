import { Mail } from "@/components/mail";
import { accounts, mails } from "./data";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const exchangeCodeForToken = useAction(api.facebook.exchangeCodeForToken);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      exchangeCodeForToken({ code })
        .then(() => {
          // Remove the code from the URL after processing
          setSearchParams((prev) => {
            prev.delete("code");
            return prev;
          });
        })
        .catch((error) => {
          console.error("Error exchanging code for token:", error);
        });
    }
  }, [searchParams, setSearchParams, exchangeCodeForToken]);

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <img
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          accounts={accounts}
          mails={mails}
          defaultLayout={undefined}
          defaultCollapsed={undefined}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}

export default App;
