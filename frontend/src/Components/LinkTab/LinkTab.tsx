import React from 'react'
import './LinkTab.sass'
import { addLinkIllustration } from '../../assets'

const LinkTab = () => {
  return (
    <div className="link-tab">
        <div className="link-tab__info">
            <h1>Customize your links</h1>
            <p>Add/edit/remove links below and then share all your profiles with the world!</p>
        </div>
        <div className="link-tab__add-link">
            <button>+ Add new link</button>
        </div>
        <div className="link-tab__description">
            <img src={addLinkIllustration} alt="Click New Link Gesture Illustration" />
            <h2>Let's get you started</h2>
            <p>Use the “Add new link” button to get started. Once you have more than one link, you can reorder and edit them. 
                We’re here to help you share your profiles with everyone!
            </p>
        </div>
    </div>
  )
}

export default LinkTab