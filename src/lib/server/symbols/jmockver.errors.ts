
export class JMockverParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JMockverParseError';
  }
}

export class JMockverRouteAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JMockverRouteAlreadyExistsError';
  }
}

export class JMockverResponseIdNotMatchedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JMockverResponseIdNotMatchedError';
  }
}

export class JMockverMethodNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JMockverMethodNotAllowedError';
  }
}

export class JMockverStatusCodeNotValidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JMockverStatusCodeNotValidError';
  }
}
