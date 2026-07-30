export const asyncHandler = (controllerFunction) => {
  return (request, response, next) => {
    Promise.resolve(
      controllerFunction(request, response, next)
    ).catch(next);
  };
};