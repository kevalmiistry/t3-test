import Link from "next/link"
import type { FC, ReactNode } from "react"

interface ISidebarAndProfile {
    children: ReactNode
}
const SidebarAndProfile: FC<ISidebarAndProfile> = ({ children }) => {
    return (
        <>
            <div className="flex h-screen">
                <div aria-label="sidebar" className="flex-[2] border">
                    <ul>
                        <Link href={"/welcome"}>
                            <li>Home</li>
                        </Link>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div
                    aria-label="main-section"
                    className="flex-[4] overflow-y-auto border"
                >
                    {children}
                </div>
                <div aria-label="profile" className="flex-[2] border">
                    <div className="h-[100px] w-[100px] rounded-full border-2"></div>
                </div>
            </div>
        </>
    )
}

export default SidebarAndProfile
