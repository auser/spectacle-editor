import { ipcRenderer } from "electron";
import React, { Component, PropTypes } from "react";
import { Viewer } from "spectacle-editor-viewer";

class Presentation extends Component {
  static propTypes = {
    screenCapture: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.lastCurrentSlideIndex = 0;

    ipcRenderer.on("update", (event, data) => {
      this.setState({
        currentSlideIndex: data.currentSlideIndex,
        presentation: {
          content: {
            slides: data.slides
          }
        }
      });
    });

    this.state = {
      presentation: null
    };
  }

  componentDidUpdate() {
    if (this.props.screenCapture) {
      setTimeout(() => {
        if (this.lastCurrentSlideIndex !== this.state.currentSlideIndex) {
          this.lastCurrentSlideIndex = this.state.currentSlideIndex;

          return;
        }

        ipcRenderer.send("ready-to-screencap", {
          currentSlideIndex: this.state.currentSlideIndex,
          numberOfSlides: this.state.presentation.content.slides.length
        });
      }, 10);
    }
  }

  render() {
    return (
      <div>
        <style>
          {`
            body {
              overflow: hidden;
            }
          `}
        </style>
        {this.props.screenCapture && <style>
          {`
            body {
              transform: scale(0.25);
              height: 700px;
              width: 1000px;
              top: -262.5px;
              left: -375px;
            }
          `}
          </style>
        }
        {this.state.presentation && <Viewer presentation={this.state.presentation} />}
      </div>
    );
  }
}

export default Presentation;
