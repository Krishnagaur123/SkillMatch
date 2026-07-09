interface OpportunityDescriptionProps {
  description: string
}

export function OpportunityDescription({ description }: OpportunityDescriptionProps) {
  if (!description) {
    return <p className="text-slate-500 italic">No description provided.</p>
  }

  // Basic parsing for line breaks to prevent "wall of text"
  const paragraphs = description.split(/\n{2,}/)

  return (
    <div className="flex flex-col gap-4 text-slate-700 dark:text-slate-300 leading-relaxed max-w-none">
      {paragraphs.map((paragraph, index) => {
        // Handle single line breaks within paragraphs
        const lines = paragraph.split('\n')
        
        return (
          <p key={index} className="text-[15px]">
            {lines.map((line, lineIdx) => (
              <span key={lineIdx}>
                {line}
                {lineIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
