import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import Todos from "./todos/todos";
import Notes from "./notes/notes";
import styles from "./todos/styles.module.css";

export class Main extends React.Component {
  eventLogger = (e, data) => {
    console.log("Event: ", e);
    console.log("Data: ", data);
  };

  render() {
    return (
      <Draggable
        axis="x"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        grid={[25, 25]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        cancel={".handle" ? ".handle" : ".moving"}
        // disabled={".handle" ? true : false}
      >
        <div
          className={` border border-1 border-[#807670] rounded-xl border-dotted shadow-lg shadow-black-100 cursor-grab active:cursor-grabbing`}
        >
          <div
            className={`moving flex justify-around ${styles.texture} m-[6px] mb-[0]`}
          >
            {this.props.isDashboardChange ? (
              <div className=" w-[70%]">
                <Notes isColored={this.props.isColored} />
              </div>
            ) : (
              <Draggable>
                <div className="handle">
                  <Todos isColored={this.props.isColored} />
                </div>
              </Draggable>
            )}
          </div>
        </div>
      </Draggable>
    );
  }
}
