export type FieldError = {
  message: string;
};

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  errors?: FieldError | undefined;
};
