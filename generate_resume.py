#!/usr/bin/env python3
"""
Resume Generator
Generates a professional resume DOCX from JSON data using python-docx.
"""
import json
import os
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml.ns import qn

def load_resume_data(filepath="resume_data.json"):
    """Load resume data from JSON file."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filepath} not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from {filepath}.")
        return {}

def setup_document():
    """Initialize document and section margins."""
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.5)
    section.bottom_margin = Inches(0.5)
    section.left_margin = Inches(0.6)
    section.right_margin = Inches(0.6)
    return doc

def setup_styles(doc):
    """Configure Normal style for consistent formatting."""
    normal = doc.styles['Normal']
    normal.font.name = 'Calibri'
    normal._element.rPr.rFonts.set(qn('w:eastAsia'), 'Calibri')
    normal.font.size = Pt(11)
    normal.font.bold = False

def add_center(doc, text, bold=False, size=None):
    """Add a centered paragraph."""
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    if size:
        r.font.size = Pt(size)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(0)
    return p

def add_section(doc, title):
    """Add a section header."""
    p = doc.add_paragraph()
    r = p.add_run(title.upper())
    r.bold = True
    r.font.size = Pt(12)
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    return p

def add_job_header(doc, left_text, right_text):
    """Add a job header with right-aligned date."""
    p = doc.add_paragraph()
    p.paragraph_format.tab_stops.add_tab_stop(Inches(6.7), WD_TAB_ALIGNMENT.RIGHT)
    r1 = p.add_run(left_text)
    r1.bold = True
    p.add_run("\t")
    r2 = p.add_run(right_text)
    r2.bold = False
    p.paragraph_format.space_after = Pt(2)
    return p

def add_bullet(doc, text):
    """Add a bullet point with hanging indent."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.first_line_indent = Inches(-0.15)
    p.paragraph_format.space_after = Pt(0)
    p.add_run("• ").bold = False
    p.add_run(text)
    return p

def edu_line(doc, left, right=None):
    """Add an education line, optionally with right-aligned text."""
    p = doc.add_paragraph()
    if right:
        p.paragraph_format.tab_stops.add_tab_stop(Inches(6.7), WD_TAB_ALIGNMENT.RIGHT)
        p.add_run(left)
        p.add_run("\t")
        p.add_run(right)
    else:
        p.add_run(left)
    p.paragraph_format.space_after = Pt(0)
    return p

def build_resume(data, output_path="public/Metehan_Ozten_Resume.docx"):
    """Build the resume DOCX from data."""
    if not data:
        return

    doc = setup_document()
    setup_styles(doc)

    # --- Header ---
    if "name" in data:
        add_center(doc, data["name"], bold=True, size=18)
    
    if "contact" in data:
        c = data["contact"]
        if "address_line1" in c:
            add_center(doc, c["address_line1"])
        if "address_line2" in c:
            add_center(doc, c["address_line2"])
        if "details" in c:
            add_center(doc, c["details"])
    doc.add_paragraph("")

    # --- Summary ---
    if "summary" in data:
        add_section(doc, "Summary")
        p = doc.add_paragraph(data["summary"])
        p.paragraph_format.space_after = Pt(2)

    # --- Education ---
    if "education" in data:
        add_section(doc, "Education")
        for edu in data["education"]:
            # Institution line
            if "institution" in edu:
                p = doc.add_paragraph()
                r = p.add_run(edu["institution"])
                r.bold = True
                p.paragraph_format.space_after = Pt(1)
            
            # Degree/Project lines
            if "items" in edu:
                for item in edu["items"]:
                    edu_line(doc, item.get("left", ""), item.get("right"))
        doc.add_paragraph("")

    # --- Experience ---
    if "experience" in data:
        add_section(doc, "Experience")
        for job in data["experience"]:
            role = job.get("role", "")
            company = job.get("company", "")
            dates = job.get("dates", "")
            
            header_left = f"{role}, {company}"
            add_job_header(doc, header_left, dates)
            
            for b in job.get("bullets", []):
                add_bullet(doc, b)
            doc.add_paragraph("")

    # --- Projects ---
    if "projects" in data:
        add_section(doc, "Projects")
        for project in data["projects"]:
            title = project.get("title", "")
            url = project.get("url", "")
            
            p = doc.add_paragraph()
            r = p.add_run(title)
            r.bold = True
            p.paragraph_format.space_after = Pt(0)
            
            if url:
                pu = doc.add_paragraph(url)
                pu.paragraph_format.space_after = Pt(2)
            else:
                doc.add_paragraph("")
                
            for b in project.get("bullets", []):
                add_bullet(doc, b)
                
            in_progress = project.get("in_progress", [])
            if in_progress:
                p2 = doc.add_paragraph()
                r2 = p2.add_run("In Progress")
                r2.bold = True
                p2.paragraph_format.space_before = Pt(2)
                p2.paragraph_format.space_after = Pt(0)
                for ip in in_progress:
                    add_bullet(doc, ip)
            doc.add_paragraph("")

    # --- Skills ---
    if "skills" in data:
        add_section(doc, "Skills")
        skills = data["skills"]
        # Handle both list and dict formats for backward compatibility
        if isinstance(skills, dict):
            for k, v in skills.items():
                p = doc.add_paragraph()
                rk = p.add_run(f"{k}: ")
                rk.bold = True
                # v could be a string "a, b, c" or a list ["a", "b"]
                content = ", ".join(v) if isinstance(v, list) else v
                p.add_run(content)
                p.paragraph_format.space_after = Pt(0)
        doc.add_paragraph("")

    # --- Distinctions ---
    if "distinctions" in data:
        add_section(doc, "Distinctions")
        for d in data["distinctions"]:
            add_bullet(doc, d)
        doc.add_paragraph("")

    # --- Leadership ---
    if "leadership" in data:
        add_section(doc, "Leadership")
        for l in data["leadership"]:
            add_bullet(doc, l)
        doc.add_paragraph("")

    # --- Publications ---
    if "publications" in data:
        add_section(doc, "Publications")
        for line in data["publications"]:
            p = doc.add_paragraph(line)
            p.paragraph_format.space_after = Pt(0)

    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc.save(output_path)
    print(f"✅ Resume generated successfully: {output_path}")

def main():
    """Main entry point."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    data = load_resume_data()
    build_resume(data)

if __name__ == "__main__":
    main()
