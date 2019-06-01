/*
Legendre_polynomials

https://zh.wikipedia.org/wiki/%E5%8B%92%E8%AE%A9%E5%BE%B7%E5%A4%9A%E9%A1%B9%E5%BC%8F

利用遞迴方法求n階勒壤得多項式的值：

#include <iostream>
using namespace std;

int main()
{
	float n,x;
	float polya(float, float);

	cout << "please input x and n:";
	cin >> x >> n;
	cout << polya(n, x) << endl;

	return 0;
}

float polya(float n, float x)
{
	if (n == 0) return 1.0;
	else if (n == 1) return x;
	else return ((2.0 * n - 1.0) * x * polya(n - 1.0, x) - (n - 1.0) * polya(n - 2.0, x)) / n;
}

*/