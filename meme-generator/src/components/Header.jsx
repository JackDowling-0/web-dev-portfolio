import React from "react"

export default function Header(props) {

    return (
        <header className="header">
            <img 
                src="./src/assets/troll-face.png" 
                className="header--image"
            />
            <h2 className="header--title">Make some crusty memes</h2>
            <h4 className="header--project">React Course - Project 3</h4>
        </header>
    )
}