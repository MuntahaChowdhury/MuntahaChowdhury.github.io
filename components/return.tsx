'use client'
import { House } from "@phosphor-icons/react"

export default function ReturnButton() {
    return(
        <>
            <House weight="bold" size={32} fill="yellow" className="cursor-pointer absolute top-0 left-0 mt-5 mx-10" onClick={() => window.location.href = '/'}/>
        </>
    )
}