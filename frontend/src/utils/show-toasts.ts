export const showErrorToast = (toast: any, description: string) => {
  toast({
    variant: "destructive",
    title: "Oops, Something Went Wrong!",
    description: description,
  });
};

export const showSuccessToast = (toast: any, description: string) => {
  toast({
    title: "Success!",
    description: description,
  });
};

export const showDefaultToastNoTitle = (toast: any, description: string) => {
  toast({
    description: description,
  });
};
