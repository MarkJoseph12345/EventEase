import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_ENDPOINTS } from "./utils/api";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const tokenValue = token?.value.replace(/['"]/g, '');
  let userData;
  if (token) {
    const response = await fetch(API_ENDPOINTS.ME, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenValue}`
      },
    });
    if (!response.ok) {
      const res = NextResponse.next();
      res.headers.set('Set-Cookie', 'token=; Path=/; Max-Age=0;');
      return res;
    } else {
      userData = await response.json();
      if (userData.profilePictureName === "XyloGraph1.png") {
        if (request.nextUrl.pathname !== "/Profile") {
          return NextResponse.redirect(new URL("/Profile", request.url));
        }
      }
      if (userData.blocked) {
        return NextResponse.redirect(new URL("/Blocked", request.url));
      }
    }
  }

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
    "/dashboard": "/Dashboard",
    "/preregister": "/Preregister",
  };

  const publicRoutes = ["/", "/AboutUs", "/Events", "/PrivacyPolicy", "/TermsAndConditions", "/Login", "/SignUp", "/Preregister"];
  const adminRoutes = ["/CreateEvent", "/ManageEvents", "/ManageUsers", "/ReportsAndAnalysis"];
  const studentRoutes = ["/AttendedEvents", "/JoinEvents", "/QRCode", "/RegisteredEvents"];

  const lowercasePathname = pathname.toLowerCase();

  if (!token && publicRoutes.map(route => route.toLowerCase()).includes(lowercasePathname)) {
    return NextResponse.next();
  }

  if (token && userData) {
    if (adminRoutes.map(route => route.toLowerCase()).includes(lowercasePathname) && userData.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/Dashboard", request.url));
    }

    if (studentRoutes.map(route => route.toLowerCase()).includes(lowercasePathname) && userData.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/Dashboard", request.url));
    }

    if (lowercasePathname === "/login" || lowercasePathname === "/signup" || lowercasePathname === "/preregister") {
      return NextResponse.redirect(new URL("/Dashboard", request.url));
    }
  } else {
    if (lowercasePathname !== "/login" && lowercasePathname !== "/signup" && lowercasePathname !== "/preregister") {
      return NextResponse.redirect(new URL("/Login", request.url));
    }
  }

  if (routes[lowercasePathname] && pathname !== routes[lowercasePathname]) {
    return NextResponse.redirect(new URL(routes[lowercasePathname], request.url));
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
    "/RegisteredEvents",
    "/",
    "/AboutUs",
    "/Events",
    "/PrivacyPolicy",
    "/TermsAndConditions",
    "/Preregister"
  ],
};