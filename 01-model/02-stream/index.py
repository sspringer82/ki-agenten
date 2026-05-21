import json
import sys
from urllib import error, request


MODEL = 'gemma4:e2b'
OLLAMA_URL = 'http://localhost:11434/v1/chat/completions'

REQUEST_BODY = {
    'model': MODEL,
    'messages': [
        {
            'role': 'system',
            'content': 'You are a comprehensive Travel Consultant.',
        },
        {
            'role': 'user',
            'content': (
                'Design a 5-day vacation to Iceland for a couple interested '
                'in photography and nature, with a budget of $5,000. Provide '
                'a daily route, suggest types of accommodation, and provide a '
                'categorized budget breakdown.'
            ),
        },
    ],
    'stream': True,
}


def get_travel_plan():
    payload = json.dumps(REQUEST_BODY).encode('utf-8')
    http_request = request.Request(
        OLLAMA_URL,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    try:
        with request.urlopen(http_request) as response:
            print('--- Travel Plan (Streaming) ---')

            for raw_line in response:
                line = raw_line.decode('utf-8').strip()

                if not line or '[DONE]' in line:
                    continue

                clean_line = line.removeprefix('data: ')

                try:
                    message = json.loads(clean_line)
                    content = message['choices'][0].get('delta', {}).get('content', '')
                    if content:
                        sys.stdout.write(content)
                        sys.stdout.flush()
                except json.JSONDecodeError:
                    continue

            print('\n\n--- Done ---')
    except error.HTTPError as exc:
        print(f'Error connecting to Ollama: HTTP error! status: {exc.code}', file=sys.stderr)
    except error.URLError as exc:
        print(f'Error connecting to Ollama: {exc.reason}', file=sys.stderr)
    except Exception as exc:
        print(f'Error connecting to Ollama: {exc}', file=sys.stderr)


if __name__ == '__main__':
    get_travel_plan()