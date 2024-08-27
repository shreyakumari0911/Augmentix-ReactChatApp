import React from "react";
import "./Banner.css";

export const Banner = ({message, type})=>{
    console.log(type, message);
    return(
        <div className={type}>
            <div className="bg-banner">
            {message}
            </div>
        </div>
    )
}