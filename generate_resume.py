#!/usr/bin/env python3
"""
Resume PDF Generator
Generates a professional resume PDF from JSON data using reportlab.
"""

import json
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY


def load_resume_data(filepath="resume_data.json"):
    """Load resume data from JSON file."""
    with open(filepath, "r") as f:
        return json.load(f)


def create_styles():
    """Create custom paragraph styles for the resume."""
    styles = getSampleStyleSheet()
    
    # Name style - large and bold
    styles.add(ParagraphStyle(
        name='Name',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a1a2e'),
        alignment=TA_CENTER,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    ))
    
    # Title style (named ResumeTitle to avoid conflict with built-in Title)
    styles.add(ParagraphStyle(
        name='ResumeTitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#4a4a6a'),
        alignment=TA_CENTER,
        spaceAfter=12,
        fontName='Helvetica'
    ))
    
    # Contact info style
    styles.add(ParagraphStyle(
        name='Contact',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#666666'),
        alignment=TA_CENTER,
        spaceAfter=16,
        fontName='Helvetica'
    ))
    
    # Section header style
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#1a1a2e'),
        spaceBefore=12,
        spaceAfter=8,
        fontName='Helvetica-Bold',
        borderWidth=1,
        borderColor=colors.HexColor('#1a1a2e'),
        borderPadding=(0, 0, 4, 0)
    ))
    
    # Job title style
    styles.add(ParagraphStyle(
        name='JobTitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#1a1a2e'),
        fontName='Helvetica-Bold',
        spaceAfter=2
    ))
    
    # Company style
    styles.add(ParagraphStyle(
        name='Company',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#4a4a6a'),
        fontName='Helvetica-Oblique',
        spaceAfter=4
    ))
    
    # Bullet point style (named ResumeBullet to avoid conflict)
    styles.add(ParagraphStyle(
        name='ResumeBullet',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        leftIndent=15,
        spaceAfter=3,
        fontName='Helvetica',
        alignment=TA_JUSTIFY
    ))
    
    # Summary style
    styles.add(ParagraphStyle(
        name='Summary',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        spaceAfter=12,
        fontName='Helvetica',
        alignment=TA_JUSTIFY
    ))
    
    # Skills style
    styles.add(ParagraphStyle(
        name='Skills',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        spaceAfter=4,
        fontName='Helvetica'
    ))
    
    return styles


def build_resume(data, output_path="public/resume.pdf"):
    """Build the resume PDF from data."""
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Create document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=0.6*inch,
        leftMargin=0.6*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    styles = create_styles()
    story = []
    
    # Header - Name and Title
    story.append(Paragraph(data["name"], styles["Name"]))
    story.append(Paragraph(data["title"], styles["ResumeTitle"]))
    
    # Contact info
    contact_parts = []
    if data.get("email"):
        contact_parts.append(data["email"])
    if data.get("phone"):
        contact_parts.append(data["phone"])
    if data.get("location"):
        contact_parts.append(data["location"])
    
    contact_line1 = " • ".join(contact_parts)
    story.append(Paragraph(contact_line1, styles["Contact"]))
    
    # Links
    link_parts = []
    if data.get("linkedin"):
        link_parts.append(data["linkedin"])
    if data.get("github"):
        link_parts.append(data["github"])
    if data.get("website"):
        link_parts.append(data["website"])
    
    if link_parts:
        contact_line2 = " • ".join(link_parts)
        story.append(Paragraph(contact_line2, styles["Contact"]))
    
    # Summary
    if data.get("summary"):
        story.append(Paragraph("SUMMARY", styles["SectionHeader"]))
        story.append(Paragraph(data["summary"], styles["Summary"]))
    
    # Experience
    if data.get("experience"):
        story.append(Paragraph("EXPERIENCE", styles["SectionHeader"]))
        
        for job in data["experience"]:
            # Job title and dates on same conceptual line
            job_header = f"{job['title']} | {job['dates']}"
            story.append(Paragraph(job_header, styles["JobTitle"]))
            
            # Company and location
            company_line = f"{job['company']}, {job['location']}"
            story.append(Paragraph(company_line, styles["Company"]))
            
            # Bullet points
            for bullet in job.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", styles["ResumeBullet"]))
            
            story.append(Spacer(1, 8))
    
    # Education
    if data.get("education"):
        story.append(Paragraph("EDUCATION", styles["SectionHeader"]))
        
        for edu in data["education"]:
            edu_header = f"{edu['degree']} | {edu['dates']}"
            story.append(Paragraph(edu_header, styles["JobTitle"]))
            
            edu_details = f"{edu['school']}, {edu['location']}"
            if edu.get("gpa"):
                edu_details += f" | GPA: {edu['gpa']}"
            story.append(Paragraph(edu_details, styles["Company"]))
            
            story.append(Spacer(1, 6))
    
    # Skills
    if data.get("skills"):
        story.append(Paragraph("SKILLS", styles["SectionHeader"]))
        
        skills = data["skills"]
        if isinstance(skills, dict):
            for category, skill_list in skills.items():
                skill_line = f"<b>{category.title()}:</b> {', '.join(skill_list)}"
                story.append(Paragraph(skill_line, styles["Skills"]))
        elif isinstance(skills, list):
            story.append(Paragraph(", ".join(skills), styles["Skills"]))
    
    # Projects
    if data.get("projects"):
        story.append(Spacer(1, 6))
        story.append(Paragraph("PROJECTS", styles["SectionHeader"]))
        
        for project in data["projects"]:
            project_header = project["name"]
            story.append(Paragraph(project_header, styles["JobTitle"]))
            
            if project.get("description"):
                story.append(Paragraph(project["description"], styles["ResumeBullet"]))
            
            if project.get("technologies"):
                tech_line = f"<i>Technologies: {', '.join(project['technologies'])}</i>"
                story.append(Paragraph(tech_line, styles["ResumeBullet"]))
            
            story.append(Spacer(1, 4))
    
    # Build the PDF
    doc.build(story)
    print(f"✅ Resume generated successfully: {output_path}")


def main():
    """Main entry point."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    data = load_resume_data()
    build_resume(data)


if __name__ == "__main__":
    main()
