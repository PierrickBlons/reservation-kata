namespace Reservation.Application;

public class Result
{
    protected Result(bool success, string error)
    {
        Success = success;
        Error = error;
    }

    public bool Success { get; }
    public string Error { get; }

    public static Result<T> Fail<T>(string message) =>
        new(default(T), false, message);

    public static Result<T> Ok<T>(T value)
    {
        return new Result<T>(value, true, string.Empty);
    }
}

public class Result<T> : Result
{
    protected internal Result(T value, bool success, string error)
        : base(success, error)
    {
        Value = value;
    }

    public T Value { get; set; }
}
