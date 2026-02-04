import { NextResponse } from "next/server";
export declare function createRequireAuth(getUser: () => Promise<any>): (req: Request) => Promise<NextResponse<unknown> | undefined>;
//# sourceMappingURL=require-auth.d.ts.map