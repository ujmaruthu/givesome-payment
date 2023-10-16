import React from 'react';

const MenuButton = (props) => {

    const clickHandler = (keyID) => {
      props.onChange(keyID)
    };
  
    return (
      <li>
        <div
          className={props.active === props.key ? "activeClass" : "inactiveClass"}
          onClick={() => clickHandler(props.key)}
        >
          {props.title}
        </div>
      </li>
    );
  };
  
  export default MenuButton;

  