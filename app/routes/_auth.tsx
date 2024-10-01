import {Outlet} from "@remix-run/react"

export default function auth() {
    return(
        <div>
            <div className={"flex justify-center font-sans my-8"}>
                <img className={"h-20 w-auto"} src={"uninet-logo.png"} alt="uninet-logo"/>
            </div>
            <Outlet/>
        </div>
    );
}

