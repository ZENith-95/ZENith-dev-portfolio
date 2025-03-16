import { FC, useState, useEffect, useRef } from "react";
import { Highlight, themes, Language } from "prism-react-renderer";

interface CodeProps {
  code: string;
  codeLast?: string;
  showCode?: boolean;
  newTextToWrite?: string;
  animated?: boolean;
  animationDelay: number;
  maxHeight?: string;
}

interface Token {
  content: string;
  types: string[];
  empty?: boolean;
}

interface HighlightRenderProps {
  className: string;
  style: React.CSSProperties;
  tokens: Token[][];
  getLineProps: (props: { line: Token[]; key: number }) => {
    className: string;
    style?: React.CSSProperties;
  };
  getTokenProps: (props: { token: Token; key: number }) => {
    className: string;
    children: string;
  };
}

const Code: FC<CodeProps> = ({
  code,
  codeLast,
  showCode = false,
  newTextToWrite,
  animated = false,
  animationDelay,
  maxHeight = "30rem",
}) => {
  const initialText = codeLast ? code + codeLast : code;
  const [text, setText] = useState<string>(animated ? "" : initialText);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Update text when initialText changes and not animated
  useEffect(() => {
    if (!animated) {
      setText(initialText);
    }
  }, [initialText, animated]);

  // Initial text animation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showCode && animated) {
      // Skip if already at full text
      if (textRef.current === initialText) return;

      let i = 0;
      const timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          setText(initialText.slice(0, i));
          i++;
          if (i > initialText.length) {
            clearInterval(intervalId);
          }
        }, 30);
      }, animationDelay || 150);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [initialText, showCode, animated, animationDelay]);

  // New text writing animation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (newTextToWrite) {
      let i = 0;
      const timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          setText((prevText) => {
            if (codeLast) {
              return code + newTextToWrite.slice(0, i) + codeLast;
            }
            return newTextToWrite.slice(0, i);
          });
          i++;
          if (i > newTextToWrite.length) {
            clearInterval(intervalId);
          }
        }, 50);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [newTextToWrite, code, codeLast]);

  return (
    <Highlight
      theme={themes.dracula}
      code={text}
      language="typescript">
      {({
        className,
        style,
        tokens,
        getLineProps,
        getTokenProps,
      }: HighlightRenderProps) => (
        <pre
          className={`${className} transition-all duration-700 no-scrollbar text-sm font-mono overflow-x-auto max-w-full`}
          style={{
            ...style,
            background: "transparent",
            paddingTop: 0,
            paddingBottom: 0,
            maxHeight: showCode ? maxHeight : 0,
            opacity: showCode ? 1 : 0,
            height: "auto",
            width: "100%",
          }}>
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line, key: i })}
              style={{ position: "relative" }}>
              {line.map((token: Token, key: number) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default Code;
