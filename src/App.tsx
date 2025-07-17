import { ZoomMtg } from "@zoom/meetingsdk";
import { useEffect, useRef } from "react";
 
if (typeof window !== "undefined") {
  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareWebSDK();
}

function ZoomSDK() {
  const MEETING_ID = useRef<string>("");
  const MEETING_PASSWORD = useRef<string>("");
  const userName = useRef<string>("");
  const userRole = useRef<"interviewer" | "candidate">("candidate");
  const token = useRef<string | null>(null);
  const APP_KEY = "dyywu7boQyqrFcnbjbIJJw";

  async function startMeeting() {
    try {
      if (!token.current) {
        throw new Error("Token is not available");
      }

      ZoomMtg.init({
        leaveUrl: "https://zoom.us",
        patchJsMedia: true,
        leaveOnPageUnload: true,
        success: async (success: unknown) => {
          console.log("Zoom SDK Init Success:", success);
          ZoomMtg.join({
            signature: token.current!,
            sdkKey: APP_KEY,
            meetingNumber: MEETING_ID.current,
            passWord: MEETING_PASSWORD.current,
            userName: userName.current,
            success: (success: unknown) => {
              console.log("Zoom SDK Join Success:", success);
              window.parent.postMessage("joinedMeeting", "*");
            },
            error: (error: unknown) => {
              console.log("Zoom SDK Join Error:", error);
            },
          });
        },
        error: (error: unknown) => {
          console.log("Zoom SDK Init Error:", error);
        },
      });
    } catch (error) {
      console.log("Zoom SDK Init Catch Error:", error);
    }
  }

  useEffect(() => {
    // Get URL search params when component mounts
    const searchParams = new URLSearchParams(window.location.search);
    MEETING_ID.current = searchParams.get("meetingNumber") || "";
    userName.current = searchParams.get("userName") || "";
    MEETING_PASSWORD.current = searchParams.get("password") || "";
    userRole.current =
      (searchParams.get("role") as "interviewer" | "candidate") || "candidate";
    token.current = searchParams.get("token") || null;
    startMeeting();
  }, []);

  return <div></div>;
}

export default ZoomSDK;
