
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteCookie } from "./utils/cookies";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const roleCookie = request.cookies.get('role');
  const role = roleCookie ? roleCookie.value : null; 
  const isProfile = request.cookies.get("naayprofile")
  const { pathname } = request.nextUrl;

  const routes: { [key: string]: string } = {
    "/createevent": "/CreateEvent",
    "/manageevents": "/ManageEvents",
    "/manageusers": "/ManageUsers",
    "/reportsandanalysis": "/ReportsAndAnalysis",
    "/attendedevents": "/AttendedEvents",
    "/joinevents": "/JoinEvents",
    "/qrcode": "/QRCode",
    "/registeredevents": "/RegisteredEvents",
    "/signup": "/SignUp",
    "/login": "/Login",
    "/profile": "/Profile",
    "/dashboard": "/Dashboard"
  };

  const adminRoutes = ["/CreateEvent", "/ManageEvents", "/ManageUsers", "/ReportsAndAnalysis"];
  const studentRoutes = ["/AttendedEvents", "/JoinEvents", "/QRCode", "/RegisteredEvents"];

  const lowercasePathname = pathname.toLowerCase();

  if (routes[lowercasePathname] && pathname !== routes[lowercasePathname]) {
    return NextResponse.redirect(new URL(routes[lowercasePathname], request.url));
  }

  if (!token && lowercasePathname === "/signup") {
    return NextResponse.next();
  }

  if (!token && lowercasePathname !== "/login" && lowercasePathname !== "/signup") {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  if (token && (lowercasePathname === "/login" || lowercasePathname === "/signup")) {
    return NextResponse.redirect(new URL("/Dashboard", request.url));
  }
  
  if (token) {
    if (adminRoutes.map(route => route.toLowerCase()).includes(lowercasePathname) && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/Dashboard", request.url));
    }

    if (studentRoutes.map(route => route.toLowerCase()).includes(lowercasePathname) && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/Dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/SignUp",
    "/Login",
    "/Profile",
    "/Dashboard",
    "/CreateEvent",
    "/ManageEvents",
    "/ManageUsers",
    "/ReportsAndAnalysis",
    "/AttendedEvents",
    "/JoinEvents",
    "/QRCode",
    "/RegisteredEvents"
  ],
};
