from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.api.v1.product import router as product_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI CRUD Project")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)



from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="frontend")

@app.get("/", response_class=HTMLResponse)
def read_home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

