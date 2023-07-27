from app.main import bp

@bp.route('/')
def index():
    return {'msg': 'Hello, youre home!'}