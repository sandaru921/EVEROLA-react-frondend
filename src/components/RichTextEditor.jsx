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
  Link,
  Unlink,
  RotateCcw,
  RotateCw,
} from "lucide-react"

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null)
  const historyIndexRef = useRef(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || ""
      setIsInitialized(true)
      // Count words after initialization
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = value || ""
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      const charCount = textContent.length
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
      const wordCount = words.length
      setCharCount(charCount)
      setWordCount(wordCount)
      // Initialize history with initial content
      setHistory([value || ""])
      setHistoryIndex(0)
      historyIndexRef.current = 0
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

  const addToHistory = useCallback((content) => {
    setHistory(prevHistory => {
      const currentIndex = historyIndexRef.current
      const newHistory = prevHistory.slice(0, currentIndex + 1)
      newHistory.push(content)
      if (newHistory.length > 50) {
        newHistory.shift()
      }
      const newIndex = newHistory.length - 1
      historyIndexRef.current = newIndex
      setHistoryIndex(newIndex)
      return newHistory
    })
  }, [])

  const countWordsAndChars = useCallback((htmlContent) => {
    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Get text content without HTML tags
    const textContent = tempDiv.textContent || tempDiv.innerText || ''
    
    // Count characters (including spaces)
    const charCount = textContent.length
    
    // Count words (split by whitespace and filter out empty strings)
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    
    setCharCount(charCount)
    setWordCount(wordCount)
  }, [])

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

        const content = editorRef.current.innerHTML
        onChange(content)
        addToHistory(content)
        return
      }

      if (command === "foreColor") {
        applyStyleSpan("color", commandValue)
        const content = editorRef.current.innerHTML
        onChange(content)
        addToHistory(content)
        return
      }

      if (command === "hiliteColor") {
        applyStyleSpan("backgroundColor", commandValue)
        const content = editorRef.current.innerHTML
        onChange(content)
        addToHistory(content)
        return
      }

      const success = document.execCommand(command, false, commandValue)
      if (!success) console.warn(`Command "${command}" failed`)
      const content = editorRef.current.innerHTML
      onChange(content)
      addToHistory(content)
    },
    [onChange, addToHistory]
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

      const content = editorRef.current.innerHTML
      onChange(content)
      addToHistory(content)
    },
    [onChange, addToHistory]
  )

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
      countWordsAndChars(content)
      addToHistory(content)
    }
  }, [onChange, countWordsAndChars, addToHistory])

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
          case "k":
            e.preventDefault()
            handleAddLink()
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              // Redo
              if (historyIndexRef.current < history.length - 1) {
                const newIndex = historyIndexRef.current + 1
                historyIndexRef.current = newIndex
                setHistoryIndex(newIndex)
                if (editorRef.current) {
                  editorRef.current.innerHTML = history[newIndex]
                  onChange(history[newIndex])
                }
              }
            } else {
              // Undo
              if (historyIndexRef.current > 0) {
                const newIndex = historyIndexRef.current - 1
                historyIndexRef.current = newIndex
                setHistoryIndex(newIndex)
                if (editorRef.current) {
                  editorRef.current.innerHTML = history[newIndex]
                  onChange(history[newIndex])
                }
              }
            }
            break
          case "y":
            e.preventDefault()
            // Redo
            if (historyIndexRef.current < history.length - 1) {
              const newIndex = historyIndexRef.current + 1
              historyIndexRef.current = newIndex
              setHistoryIndex(newIndex)
              if (editorRef.current) {
                editorRef.current.innerHTML = history[newIndex]
                onChange(history[newIndex])
              }
            }
            break
        }
      }
    },
    [executeCommand, onChange]
  )

  const handleAddLink = useCallback(() => {
    if (!editorRef.current) return
    
    editorRef.current.focus()
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    
    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    
    // If no text is selected, show a message or use placeholder
    if (!selectedText.trim()) {
      // You can either show an alert or just proceed with empty text
      // For now, let's proceed with empty text and let user fill it
    }
    
    // Store the current selection for later use
    const savedRange = range.cloneRange()
    
    setLinkText(selectedText)
    setLinkUrl("")
    setShowLinkDialog(true)
    
    // Store the range in a ref for later use
    window.linkRange = savedRange
  }, [])

  const handleRemoveLink = useCallback(() => {
    if (!editorRef.current) return
    
    editorRef.current.focus()
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    
    const range = selection.getRangeAt(0)
    const linkElement = range.commonAncestorContainer.nodeType === 1 
      ? range.commonAncestorContainer.closest('a')
      : range.commonAncestorContainer.parentElement?.closest('a')
    
    if (linkElement) {
      const textContent = linkElement.textContent
      linkElement.replaceWith(textContent)
      const content = editorRef.current.innerHTML
      onChange(content)
      addToHistory(content)
    }
  }, [onChange, addToHistory])

  const handleInsertLink = useCallback(() => {
    if (!editorRef.current || !linkUrl.trim()) return
    
    editorRef.current.focus()
    
    // Use stored range if available, otherwise get current selection
    let range
    if (window.linkRange) {
      range = window.linkRange
      window.linkRange = null // Clear the stored range
    } else {
      const selection = window.getSelection()
      if (!selection.rangeCount) return
      range = selection.getRangeAt(0)
    }
    
    const selectedText = range.toString() || linkText
    
    if (selectedText) {
      const linkElement = document.createElement('a')
      linkElement.href = linkUrl.trim()
      linkElement.textContent = selectedText
      linkElement.target = "_blank"
      linkElement.rel = "noopener noreferrer"
      
      range.deleteContents()
      range.insertNode(linkElement)
      
      const content = editorRef.current.innerHTML
      onChange(content)
      addToHistory(content)
    }
    
    setShowLinkDialog(false)
    setLinkUrl("")
    setLinkText("")
  }, [linkUrl, linkText, onChange, addToHistory])



  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      const newIndex = historyIndexRef.current - 1
      historyIndexRef.current = newIndex
      setHistoryIndex(newIndex)
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex]
        onChange(history[newIndex])
      }
    }
  }, [history, onChange])

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < history.length - 1) {
      const newIndex = historyIndexRef.current + 1
      historyIndexRef.current = newIndex
      setHistoryIndex(newIndex)
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex]
        onChange(history[newIndex])
      }
    }
  }, [history, onChange])

  const handleLinkClick = useCallback((e) => {
    // Check if the clicked element is a link
    const linkElement = e.target.closest('a')
    if (linkElement) {
      e.preventDefault()
      e.stopPropagation()
      
      // Open link in new tab
      const url = linkElement.href
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
  }, [])

  const handleLinkKeyDown = useCallback((e) => {
    // Allow Enter key to open links
    if (e.key === 'Enter') {
      const linkElement = e.target.closest('a')
      if (linkElement) {
        e.preventDefault()
        const url = linkElement.href
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer')
        }
      }
    }
  }, [])



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

        <ToolbarButton 
          onClick={handleUndo} 
          icon={RotateCcw} 
          title="Undo (Ctrl+Z)"
          isActive={historyIndex > 0}
        />
        <ToolbarButton 
          onClick={handleRedo} 
          icon={RotateCw} 
          title="Redo (Ctrl+Y)"
          isActive={historyIndex < history.length - 1}
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => handleList("ul")} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => handleList("ol")} icon={ListOrdered} title="Numbered List" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => executeCommand("justifyLeft")} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => executeCommand("justifyCenter")} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => executeCommand("justifyRight")} icon={AlignRight} title="Align Right" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={handleAddLink} icon={Link} title="Add Link (Ctrl+K)" />
        <ToolbarButton onClick={handleRemoveLink} icon={Unlink} title="Remove Link" />

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
        onKeyDown={(e) => {
          handleKeyDown(e)
          handleLinkKeyDown(e)
        }}
        onClick={handleLinkClick}
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

      {/* Word Counter */}
      <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowLinkDialog(false)
            setLinkUrl("")
            setLinkText("")
            window.linkRange = null
          }}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
                  placeholder="Link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowLinkDialog(false)
                  setLinkUrl("")
                  setLinkText("")
                  window.linkRange = null
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                className="px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66]"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

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
        [contenteditable] a {
          color: #005B7C;
          text-decoration: underline;
          cursor: pointer;
        }
        [contenteditable] a:hover {
          color: #004d66;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor

