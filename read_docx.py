import docx

def getText(filename):
    doc = docx.Document(filename)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return '\n'.join(fullText)

try:
    print(getText('public/Metehan_Ozten_Resume.docx'))
except Exception as e:
    print(e)
