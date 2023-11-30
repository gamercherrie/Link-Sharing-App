import React, { useState } from 'react'
import { logoSymbol, previewIcon } from '../../assets'
import { LinkTab } from '../../Components/'
import './Homepage.sass'

interface IArrayInput {
  type: string;
  id: number;
  value: string;
}


const Homepage = () => {
  const [ activeTab, setActiveTab ] = useState<string>("Link-Tab");
  const [ linkForms, setLinkForms ] = useState<IArrayInput>();
 
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { id } = e.currentTarget as HTMLButtonElement;
    console.log('The event target: ', e.currentTarget.id)

    id === 'link-button' ? setActiveTab("Link-Tab") : setActiveTab("Profile-Tab");

  }

  return (
    <div className='homepage'>
        <div className='homepage__header'>
        <img src={logoSymbol} alt='website logo' />
          <div className='homepage__header-links'>
            <button id='link-button' onClick={(e) => handleButtonClick(e)} className='header__button-links active-tab'>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><path d="M11.154 14.65a.936.936 0 0 1 0 1.329l-.464.464a4.689 4.689 0 1 1-6.631-6.631l1.884-1.884a4.687 4.687 0 0 1 6.432-.194.941.941 0 0 1-1.25 1.407 2.813 2.813 0 0 0-3.857.114l-1.883 1.882a2.813 2.813 0 1 0 3.978 3.978l.464-.464a.936.936 0 0 1 1.327 0ZM16.94 3.558a4.695 4.695 0 0 0-6.63 0l-.465.464a.94.94 0 1 0 1.328 1.328l.464-.464a2.813 2.813 0 0 1 3.978 3.978l-1.883 1.885a2.813 2.813 0 0 1-3.858.111.942.942 0 0 0-1.25 1.407 4.688 4.688 0 0 0 6.43-.19l1.884-1.884a4.695 4.695 0 0 0 .002-6.633v-.002Z"/></svg>
            </button>
            <button id='profile-button' onClick={(e) => handleButtonClick(e)} className='header__button-profile'>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><path d="M10.5 1.563A8.437 8.437 0 1 0 18.938 10 8.447 8.447 0 0 0 10.5 1.562ZM6.716 15.357a4.688 4.688 0 0 1 7.568 0 6.54 6.54 0 0 1-7.568 0Zm1.596-5.982a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Zm7.344 4.683a6.523 6.523 0 0 0-2.265-1.83 4.062 4.062 0 1 0-5.782 0 6.522 6.522 0 0 0-2.265 1.83 6.562 6.562 0 1 1 10.304 0h.008Z"/></svg>
            </button>
          </div>
          <button className='header__button-preview'><img src={previewIcon} alt='Preview Icon'/></button>
        </div>
        <div className="homepage__main">
          { activeTab === 'Link-Tab' ? <LinkTab /> : <div>Profile Tab</div>}
        </div>
        <section className="homepage__save">
          <div className="homepage__save-frame">
            <button>Save</button>
          </div>
        </section>
    </div>
  )
}

export default Homepage