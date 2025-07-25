"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || ""
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  useEffect(() => {
    if (editorRef.current && isInitialized && editorRef.current.innerHTML !== value) {
      const selection = window.getSelection()
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null
      editorRef.current.innerHTML = value || ""

      if (range) {
        try {
          selection.removeAllRanges()
          selection.addRange(range)
        } catch {}
      }
    }
  }, [value, isInitialized])

  const removeFontSizeStyles = (node) => {
    if (node.nodeType === 1) {
      const el = node
      if (el.style.fontSize) {
        el.style.fontSize = ""
        if (!el.getAttribute("style")) el.removeAttribute("style")
      }
      Array.from(el.childNodes).forEach(removeFontSizeStyles)
    }
  }

  const removeHighlightStyles = (node) => {
    if (node.nodeType === 1) {
      const el = node
      if (el.style.backgroundColor) {
        el.style.backgroundColor = ""
        if (!el.getAttribute("style")) el.removeAttribute("style")
      }
      Array.from(el.childNodes).forEach(removeHighlightStyles)
    }
  }

  const applyStyleSpan = (styleName, styleValue) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    const range = selection.getRangeAt(0)
    if (range.collapsed) return

    const fragment = range.extractContents()

    if (styleValue === "transparent" && styleName === "backgroundColor") {
      range.insertNode(fragment)
      removeHighlightStyles(editorRef.current)
      onChange(editorRef.current.innerHTML)
      return
    } else {
      const span = document.createElement("span")
      span.style[styleName] = styleValue
      span.appendChild(fragment)
      range.insertNode(span)
    }

    selection.removeAllRanges()
    const newRange = document.createRange()
    newRange.setStartAfter(range.endContainer)
    newRange.collapse(true)
    selection.addRange(newRange)

    onChange(editorRef.current.innerHTML)
  }

  const executeCommand = useCallback(
    (command, commandValue = null) => {
      if (!editorRef.current) return
      editorRef.current.focus()
      const selection = window.getSelection()
      if (!selection.rangeCount) return
      const range = selection.getRangeAt(0)

      if (command === "fontSize") {
        if (range.collapsed) return
        const fragment = range.cloneContents()
        removeFontSizeStyles(fragment)
        range.deleteContents()

        const span = document.createElement("span")
        const fontSizes = {
          "1": "0.75rem",
          "2": "0.875rem",
          "3": "1rem",
          "4": "1.125rem",
          "5": "1.5rem",
          "6": "2rem",
          "7": "3rem",
        }
        span.style.fontSize = fontSizes[commandValue] || "1rem"
        span.appendChild(fragment)
        range.insertNode(span)

        const newRange = document.createRange()
        newRange.setStartAfter(span)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)

        onChange(editorRef.current.innerHTML)
        return
      }

      if (command === "foreColor") {
        applyStyleSpan("color", commandValue)
        return
      }

      if (command === "hiliteColor") {
        applyStyleSpan("backgroundColor", commandValue)
        return
      }

      const success = document.execCommand(command, false, commandValue)
      if (!success) console.warn(`Command "${command}" failed`)
      onChange(editorRef.current.innerHTML)
    },
    [onChange]
  )

  const handleList = useCallback(
    (listType) => {
      if (!editorRef.current) return
      editorRef.current.focus()

      const selection = window.getSelection()
      if (selection.rangeCount === 0) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }

      const command = listType === "ul" ? "insertUnorderedList" : "insertOrderedList"
      const success = document.execCommand(command, false, null)

      if (!success) {
        const selectedText = selection.toString() || "List item"
        const listTag = listType === "ul" ? "ul" : "ol"
        const listHTML = `<${listTag}><li>${selectedText}</li></${listTag}>`

        try {
          document.execCommand("insertHTML", false, listHTML)
        } catch {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          const listElement = document.createElement(listTag)
          const listItem = document.createElement("li")
          listItem.textContent = selectedText
          listElement.appendChild(listItem)
          range.insertNode(listElement)
        }
      }

      onChange(editorRef.current.innerHTML)
    },
    [onChange]
  )

  const handleInput = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange])

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      if (text) executeCommand("insertText", text)
    },
    [executeCommand]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            executeCommand("bold")
            break
          case "i":
            e.preventDefault()
            executeCommand("italic")
            break
          case "u":
            e.preventDefault()
            executeCommand("underline")
            break
        }
      }
    },
    [executeCommand]
  )

  const ToolbarButton = ({ onClick, icon: Icon, title, isActive = false }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? "bg-blue-100 text-blue-600" : "text-gray-600"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )

  return (
    <div className={`relative border rounded-md ${isFocused ? "ring-2 ring-[#005B7C] border-[#005B7C]" : "border-gray-300"}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 select-none">
        <ToolbarButton onClick={() => executeCommand("bold")} icon={Bold} title="Bold (Ctrl+B)" />
        <ToolbarButton onClick={() => executeCommand("italic")} icon={Italic} title="Italic (Ctrl+I)" />
        <ToolbarButton onClick={() => executeCommand("underline")} icon={Underline} title="Underline (Ctrl+U)" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => handleList("ul")} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => handleList("ol")} icon={ListOrdered} title="Numbered List" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => executeCommand("justifyLeft")} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => executeCommand("justifyCenter")} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => executeCommand("justifyRight")} icon={AlignRight} title="Align Right" />

        {/* Font size */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              executeCommand("fontSize", e.target.value)
              e.target.value = ""
            }
          }}
          className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded"
          defaultValue=""
        >
          <option value="">Font Size</option>
          <option value="1">Very Small</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">Very Large</option>
          <option value="6">Huge</option>
          <option value="7">Extra Large</option>
        </select>

        {/* Text color */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              executeCommand("foreColor", e.target.value)
              e.target.value = ""
            }
          }}
          className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded"
          defaultValue=""
        >
          <option value="">Text Color</option>
          <option value="#000000">Black</option>
          <option value="#005B7C">Blue</option>
          <option value="#dc2626">Red</option>
          <option value="#16a34a">Green</option>
          <option value="#ca8a04">Orange</option>
          <option value="#9333ea">Purple</option>
          <option value="#6b7280">Gray</option>
        </select>

        {/* Highlight color */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              executeCommand("hiliteColor", e.target.value)
              e.target.value = ""
            }
          }}
          className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded"
          defaultValue=""
        >
          <option value="">Highlight</option>
          <option value="yellow">Yellow</option>
          <option value="lightgreen">Green</option>
          <option value="lightblue">Blue</option>
          <option value="pink">Pink</option>
          <option value="transparent">Remove</option>
        </select>
      </div>

      {/* Editable content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="min-h-[300px] p-4 focus:outline-none"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          outline: "none",
          whiteSpace: "pre-wrap",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        spellCheck={true}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
          user-select: none;
        }
        [contenteditable]:focus:before {
          display: none;
        }
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 20px;
          padding-left: 10px;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 20px;
          padding-left: 10px;
        }
        [contenteditable] li {
          margin: 5px 0;
          padding-left: 5px;
        }
        [contenteditable] span[style*="font-size"] {
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor

