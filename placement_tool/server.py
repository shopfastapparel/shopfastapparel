import os
import sys
import json
import subprocess
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
APP_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

class PlacementHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_HEAD(self):
        if self.path.startswith("/api/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            return
        super().do_HEAD()

    def do_GET(self):
        if self.path.startswith("/api/config_joseph_ladwin"):
            config_path = os.path.join(APP_ROOT, "joseph_ladwin_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
        if self.path.startswith("/api/config_crystle"):
            config_path = os.path.join(APP_ROOT, "crystle_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_sarah"):
            config_path = os.path.join(APP_ROOT, "sarah_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_shantal"):
            config_path = os.path.join(APP_ROOT, "shantal_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_sharmaine"):
            config_path = os.path.join(APP_ROOT, "sharmaine_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_brooke"):
            config_path = os.path.join(APP_ROOT, "brooke_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_shade_wale"):
            config_path = os.path.join(APP_ROOT, "shade_wale_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_evelyn"):
            config_path = os.path.join(APP_ROOT, "evelyn_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_christopher"):
            config_path = os.path.join(APP_ROOT, "christopher_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
        if self.path.startswith("/api/config_armani") or self.path.startswith("/api/config_amani"):
            config_path = os.path.join(APP_ROOT, "armani_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_ronnie"):
            config_path = os.path.join(APP_ROOT, "ronnie_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
        if self.path.startswith("/api/config_ursa"):
            config_path = os.path.join(APP_ROOT, "ursa_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_april"):
            config_path = os.path.join(APP_ROOT, "april_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        if self.path.startswith("/api/config_lauren"):
            config_path = os.path.join(APP_ROOT, "lauren_placement_config.json")
            if os.path.exists(config_path):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(config_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/save_mary_wilson":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "mary_wilson_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved new Mary Wilson config to {config_path}")

                # Trigger custom render
                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_mary_wilson_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Render stderr: {res.stderr}")

                # Note: DO NOT send customer email - strictly local proof & preview update

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and mockups re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "fofmbc_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved new config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Render output: {res.stdout}")

                email_script = os.path.join(APP_ROOT, "send_fofmbc_preview.py")
                subprocess.run([sys.executable, email_script], capture_output=True, text=True, cwd=APP_ROOT, env=env)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and mockups rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save_suzy":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "suzy_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved new Suzy config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_suzy_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Suzy render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Suzy render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Suzy placement applied and proof re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save_mary_goodwin":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "mary_goodwin_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Mary Goodwin config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_mary_goodwin_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Mary Goodwin render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Mary Goodwin render stderr: {res.stderr}")

                # Note: DO NOT send customer email - strictly local proof update
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Mary Goodwin placement applied and proof rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save_chaya":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "chaya_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Chaya Fischer config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_chaya_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Chaya render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Chaya render stderr: {res.stderr}")

                # Note: DO NOT send customer email - strictly local proof & preview update
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Chaya placement applied and proof rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save_kyle":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "kyle_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Kyle Hatley config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_kyle_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Kyle render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Kyle render stderr: {res.stderr}")

                # Update HTML preview
                preview_script = os.path.join(APP_ROOT, "generate_kyle_quote_preview.py")
                if os.path.exists(preview_script):
                    subprocess.run([sys.executable, preview_script], capture_output=True, text=True, cwd=APP_ROOT, env=env)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Kyle placement applied and proof rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save_sharmaine":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "sharmaine_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "sharmaine", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Sharmaine config to {config_path} and {pub_config}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_sharmaine_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Sharmaine render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Sharmaine render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Sharmaine placement applied and proof rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif self.path == "/api/save_joseph_ladwin":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "joseph_ladwin_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "joseph_ladwin", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Joseph Ladwin config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_joseph_ladwin_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Joseph Ladwin render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Joseph Ladwin render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_shantal":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "shantal_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "shantal", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Shantal config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_shantal_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Shantal render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Shantal render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_sarah":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "sarah_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "sarah", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Sarah config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_sarah_custom_placements.py")
                res = subprocess.run(["/usr/bin/python3", render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Sarah render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Sarah render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_crystle":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "crystle_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "crystle", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Crystle config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_crystle_custom_placements.py")
                res = subprocess.run(["/usr/bin/python3", render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Crystle render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Crystle render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_brooke":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "brooke_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "brooke", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Brooke config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_brooke_custom_placements.py")
                res = subprocess.run(["/usr/bin/python3", render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Brooke render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Brooke render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_shade_wale":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "shade_wale_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "shade_wale", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Shade Wale config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_shade_wale_custom_placements.py")
                res = subprocess.run(["/usr/bin/python3", render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Shade Wale render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Shade Wale render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_evelyn":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "evelyn_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "evelyn", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Evelyn config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_evelyn_custom_placements.py")
                res = subprocess.run(["/usr/bin/python3", render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Evelyn render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Evelyn render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_christopher":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "christopher_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "christopher", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Christopher config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_christopher_custom_placements.py")
                res = subprocess.run(["/usr/bin/python3", render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Christopher render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Christopher render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path in ["/api/save_armani", "/api/save_amani"]:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "armani_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "armani", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Armani config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_armani_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Armani render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Armani render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_ronnie":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "ronnie_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "ronnie", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Ronnie config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_ronnie_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Ronnie render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Ronnie render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_ursa":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "ursa_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "ursa", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Ursa config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_ursa_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Ursa render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Ursa render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_april":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "april_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "april", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved April config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_april_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] April render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] April render stderr: {res.stderr}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/save_lauren":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                config_path = os.path.join(APP_ROOT, "lauren_placement_config.json")
                with open(config_path, "w") as f:
                    json.dump(data, f, indent=2)
                pub_config = os.path.join(PUBLIC_DIR, "lauren", "config.json")
                with open(pub_config, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"[Placement Server] Saved Lauren config to {config_path}")

                env = os.environ.copy()
                env["DEVELOPER_DIR"] = "/Library/Developer/CommandLineTools"
                render_script = os.path.join(APP_ROOT, "render_lauren_custom_placements.py")
                res = subprocess.run([sys.executable, render_script, config_path], capture_output=True, text=True, cwd=APP_ROOT, env=env)
                print(f"[Placement Server] Lauren render output: {res.stdout}")
                if res.stderr:
                    print(f"[Placement Server] Lauren render stderr: {res.stderr}")
                if res.returncode != 0:
                    raise Exception(f"Render script failed (exit code {res.returncode}): {res.stderr or res.stdout}")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Placements applied and proofs re-rendered!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

print(f"Starting Mockup Design Placement Studio server at http://localhost:{PORT}")
httpd = HTTPServer(("127.0.0.1", PORT), PlacementHandler)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nShutting down server.")
