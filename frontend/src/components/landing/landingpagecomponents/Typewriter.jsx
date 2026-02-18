import React from "react";

class TypeWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      wordIndex: 0,
      isDeleting: false,
      isWaiting: false,
      showCursor: true,
    };
  }

  componentDidMount() {
    this.type();
    this.cursorInterval = setInterval(() => {
      this.setState((prevState) => ({
        showCursor: !prevState.showCursor,
      }));
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.typeTimeout);
    clearInterval(this.cursorInterval);
  }

  type = () => {
    const { wordIndex, isDeleting, text } = this.state;
    const currentIndex = wordIndex % this.props.words.length;
    const currentWord = this.props.words[currentIndex];

    this.setState({ isWaiting: false });

    if (isDeleting) {
      this.setState({
        text: currentWord.substring(0, text.length - 1),
      });
    } else {
      this.setState({
        text: currentWord.substring(0, text.length + 1),
      });
    }

    let typeSpeed = 100;

    if (isDeleting) {
      typeSpeed /= 2;
    }

    if (!isDeleting && text === currentWord) {
      typeSpeed = 1000;
      this.setState({
        isWaiting: true,
        isDeleting: true,
      });
    } else if (isDeleting && text === "") {
      this.setState({
        isDeleting: false,
        wordIndex: wordIndex + 1,
      });
      typeSpeed = 200;
    }

    this.typeTimeout = setTimeout(() => this.type(), typeSpeed);
  };

  render() {
    const { text, isWaiting, showCursor } = this.state;
    return (
      <span className="inline-block font-accent tracking-tight">
        {text}
        <span
          className={`transition-opacity duration-200 ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
        >
          |
        </span>
      </span>
    );
  }
}

export default TypeWriter;
