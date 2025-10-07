from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import textwrap

# Register a Unicode-compatible font for Lithuanian characters
# Using DejaVu Sans which supports Lithuanian characters
try:
    # Try to register DejaVu Sans if available
    pdfmetrics.registerFont(TTFont('DejaVuSans', 'DejaVuSans.ttf'))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', 'DejaVuSans-Bold.ttf'))
    FONT_REGULAR = 'DejaVuSans'
    FONT_BOLD = 'DejaVuSans-Bold'
except:
    # Fallback to built-in fonts that support Unicode
    try:
        pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
        pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
        FONT_REGULAR = 'Arial'
        FONT_BOLD = 'Arial-Bold'
    except:
        # Last resort - use Helvetica but with proper encoding
        FONT_REGULAR = 'Helvetica'
        FONT_BOLD = 'Helvetica-Bold'

filename = "papeikimas_proto_pisimo.pdf"
c = canvas.Canvas(filename, pagesize=A4)
width, height = A4

# Dokumento turinys (lietuvių kalba), teisiškai skambus ir formalus
title = "P A R E I Š K I M A S    D Ė L    P R O T O    P I S I M O"
date_place = "2025 m. spalio 1 d.  |  Vilnius"

intro = (
    "Šiuo dokumentu teikiamas oficialus pareiškimas dėl proto pisimo, kuris laikomas netoleruotinu veiksmu "
    "darbo vietoje. Pareiškimas dėl proto pisimo fiksuoja faktą, kad darbuotojas Jonas Jusys "
    "elgėsi netinkamai, sukeldamas neigiamą psichologinę atmosferą savo kolegai Tomui Meškutavičiui."
)

details = (
    "Pareiškimas dėl proto pisimo pateikiamas tam, kad būtų tinkamai įformintas incidentas ir užtikrintas "
    "jo dokumentavimas. Šiame pareiškime dėl proto pisimo aiškiai įvardijama, kad minėtas elgesys prieštarauja "
    "profesinės etikos normoms. Pakartotinai pabrėžiama, kad pareiškimas dėl proto pisimo yra oficiali vidaus procedūra, "
    "kuria siekiama išvengti panašių atvejų ateityje.\n\n"
    "Pareiškimas dėl proto pisimo taip pat tarnauja kaip prevencinė priemonė, rodanti, kad įmonėje yra nustatyti aiškūs "
    "elgesio standartai. Dokumentas, kuriame užfiksuotas pareiškimas dėl proto pisimo, bus saugomas Jono Jusio personalo byloje "
    "ir laikomas oficialiu įrodymu, jog darbuotojas buvo įspėtas.\n\n"
    "Toliau patvirtinama, kad pareiškimas dėl proto pisimo turi būti vertinamas itin rimtai ir jo pagrindu gali būti "
    "inicijuotos drausminės priemonės. Šis pareiškimas dėl proto pisimo įgyja galiojimą nuo jo pasirašymo momento."
)

closing = (
    "Pareiškimas dėl proto pisimo laikomas užregistruotu ir įforminamas šiame dokumente.\n\n"
    "\nTomas Meškutavičius\n\nData: 2025-10-01\n\n(Parašas)"
)

# Pradėti braižyti PDF
c.setFont(FONT_BOLD, 16)
c.drawCentredString(width/2, height - 30*mm, title)
c.setFont(FONT_REGULAR, 10)
c.drawCentredString(width/2, height - 40*mm, date_place)

# Kairėje informacija apie pareiškėją ir atsakovą
text_x = 20*mm
y = height - 55*mm
c.setFont(FONT_BOLD, 11)
y -= 7*mm
c.setFont(FONT_REGULAR, 10)

for block in [intro, "", details, ""]:
    for line in textwrap.wrap(block, 95):
        c.drawString(text_x, y, line)
        y -= 6*mm
    y -= 2*mm

# Uždarymas ir parašas
if y < 60*mm:
    c.showPage()
    y = height - 30*mm

for line in closing.split("\n"):
    c.drawString(text_x, y, line)
    y -= 6*mm

c.save()
filename