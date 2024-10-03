import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import Todos from "./todos/todos";
import Notes from "./notes/notes";
import styles from "./todos/styles.module.css";
import kanbanStyles from "./kanban/styles.module.css";
import Kanban from "./kanban/kanban";

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNoteId: null,
      noteOrder: [],
    };
  }

  setActiveNote = (id) => {
    this.setState((prevState) => {
      console.log("Previous state noteOrder:", prevState.noteOrder);
      if (!Array.isArray(prevState.noteOrder)) {
        console.error("noteOrder is not an array:", prevState.noteOrder);
        return {
          activeNoteId: id,
          noteOrder: [id], // Initialize as an array if it is not already
        };
      }
      const updatedNoteOrder = [
        ...prevState.noteOrder.filter((noteId) => noteId !== id),
        id,
      ];
      console.log("Updated noteOrder:", updatedNoteOrder);
      return {
        activeNoteId: id,
        noteOrder: updatedNoteOrder,
      };
    });
  };

  getZIndex = (id) => {
    return this.state.noteOrder.indexOf(id) + 1;
  };

  eventLogger = (e, data) => {
    console.log("Event: ", e);
    console.log("Data: ", data);
  };

  render() {
    return (
      <>
        <div
          className={`border border-1 border-[#807670] rounded-xl border-dotted shadow-lg shadow-black-100 cursor-grab active:cursor-grabbing`}
        >
          <div
            className={`moving flex justify-around ${styles.texture} m-[6px] mb-[0]`}
          >
            {this.props.activeComponent === "Notes" && (
              <div className="w-[70%]">
                <Notes
                  isColored={this.props.isColored}
                  activeNoteId={this.state.activeNoteId}
                  setActiveNote={this.setActiveNote}
                  noteOrder={this.state.noteOrder}
                  getZIndex={this.getZIndex}
                />
              </div>
            )}
            {this.props.activeComponent === "Kanban" && (
              <div className="handle">
                <Kanban isColored={this.props.isColored} />
              </div>
            )}
            {this.props.activeComponent === "Todos" && (
              <Draggable cancel=".no-drag">
                <div className="handle sm:w-[95%] w-[30em]">
                  <Todos isColored={this.props.isColored} />
                </div>
              </Draggable>
            )}
          </div>
        </div>
      </>
    );
  }
}
