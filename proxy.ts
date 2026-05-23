export { default as proxy } from "next-auth/middleware";



export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/invoices/:path*",
  ],
};